const db = require('../db')
class AdController{
    async createAd(req, res){
        const {date, elo, gender, high_age_lvl, is_active, low_age_lvl, tag, text, user_id, game_id, goal_id}=req.body
        const newAd= await db.query('INSERT INTO t_ad (date, elo, gender, high_age_lvl, is_active, low_age_lvl, tag, text, user_id, game_id, goal_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *',
            [date, elo, gender, high_age_lvl, is_active, low_age_lvl, tag, text, user_id, game_id, goal_id]);
        res.json(newAd);
    }
    async getAd(req, res){
        const ads= await db.query('SELECT * FROM t_ad order by date');
        res.json(ads.rows);
    }
    async getOneAd(req, res){
        const id=req.params.id
        const user= await db.query('SELECT * FROM t_ad where id=$1', [id]);
        res.json(user.rows[0]);
    }
    async updateAd(req, res){
        const {id, date, elo, gender, high_age_lvl, is_active, low_age_lvl, tag, text, user_id, game_id, goal_id}=req.body
        if(typeof(id) == "undefined")
            throw "You must give an id";
        const updatedAd= await db.query('UPDATE t_ad SET date=$1, elo=$2, gender=$3, high_age_lvl=$4, is_active=$5, low_age_lvl=$6, tag=$7, text=$8, user_id=$9, game_id=$10, goal_id=$11 where id=$12 returning *',
            [date, elo, gender, high_age_lvl, is_active, low_age_lvl, tag, text, user_id, game_id, goal_id, id]);
        res.json(updatedAd);
    }
    async deleteAd(req, res){
        const id=req.params.id
        const ad= await db.query('DELETE FROM t_ad where id=$1', [id]);
        res.json('ok');
    }

}

module.exports = AdController;