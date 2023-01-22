const db = require('../db')
const SECRET_WORD = require("../config");
const jwt = require('jsonwebtoken');

class AdController {
    async createAd(req, res) {
        const { elo, gender, high_age_lvl, is_active, low_age_lvl, tag, text, game_id, goal_id} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const newAd = await db.query('INSERT INTO t_ad (date, elo, gender, high_age_lvl, is_active, low_age_lvl, tag, text, user_id, game_id, goal_id) values (now(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *',
            [ elo, gender, high_age_lvl, is_active, low_age_lvl, tag, text, decoded.userId, game_id, goal_id]);
        res.json(newAd);
    }

    async getAd(req, res) {
        const last_num = req.headers.last_num;
        let ads = await db.query('SELECT * FROM t_ad order by date desc limit $1',[last_num]);
        let index=0;
        let ans=[];
        for (index = last_num-3; index < ads.rows.length; ++index) {
            const game = await db.query('SELECT * FROM t_games where id=$1', [ads.rows[index].game_id]);
            const goal = await db.query('SELECT * FROM t_goals where id=$1', [ads.rows[index].goal_id]);
            const user = await db.query('SELECT * FROM t_user where id=$1', [ads.rows[index].user_id]);
            ads.rows[index].game_id=game.rows[0].game_name;
            ads.rows[index].goal_id=goal.rows[0].goal_name;
            if(!ads.rows[index].user_id)
                ads.rows[index].user_id="No user";
               else
                ads.rows[index].user_id=user.rows[0].username;
            ans.push(ads.rows[index]);
        }
        let responseStruct;
        if(ans.length<3){
            responseStruct={
                main:ans,
                last_part:true
            }
        res.json(responseStruct);}
        else{
            responseStruct={
                main:ans,
                last_part:false
            }
            res.json(responseStruct);
        }
    }
    async getMyAd(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        let ads = await db.query('SELECT * FROM t_ad where user_id=$1 order by date desc', [decoded.userId]);
        let index=0;
        for (index = 0; index < ads.rows.length; ++index) {
            const game = await db.query('SELECT * FROM t_games where id=$1', [ads.rows[index].game_id]);
            const goal = await db.query('SELECT * FROM t_goals where id=$1', [ads.rows[index].goal_id]);
            ads.rows[index].game_id=game.rows[0].game_name;
            ads.rows[index].goal_id=goal.rows[0].goal_name;
            ads.rows[index].user_id=decoded.username;
        }
            res.json(ads.rows);

    }
    async getOneAd(req, res) {
        const id = req.params.id//переделать под сбор от имени
        const user = await db.query('SELECT * FROM t_ad where id=$1', [id]);
        res.json(user.rows[0]);
    }

    async updateAd(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const {id, elo, gender, high_age_lvl, low_age_lvl, tag, text, game_id, goal_id} = req.body
        if (typeof (id) == "undefined")
            throw "You must give an id";
        const updatedAd = await db.query('UPDATE t_ad SET date=now(), elo=$1, gender=$2, high_age_lvl=$3, is_active=true, low_age_lvl=$4, tag=$5, text=$6, game_id=$7, goal_id=$8 where id=$9 and user_id=$10 returning *',
            [elo, gender, high_age_lvl, low_age_lvl, tag, text, game_id, goal_id, id, decoded.userId]);
        res.json(updatedAd);
    }

    async deleteAd(req, res) {
        const id = req.params.id
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const ad = await db.query('DELETE FROM t_ad where id=$1 and user_id=$2', [id, decoded.userId]);
        res.json('ok');
    }

}

module.exports = AdController;