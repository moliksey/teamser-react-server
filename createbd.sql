CREATE TABLE t_role(
    id BIGSERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE
);
Insert into t_role(name) values ('ROLE_ADMIN'), ('ROLE_USER');
CREATE TABLE t_games(
    id BIGSERIAL PRIMARY KEY,
    game_name text NOT NULL UNIQUE
);
insert into t_games(game_name) values ('LeagueOfLegends'), ('Dota 2'), ('CS GO'), ('Rocket League'), ('Gensin Impact');
CREATE TABLE t_goals(
    id BIGSERIAL PRIMARY KEY,
    goal_name text NOT NULL UNIQUE
);
insert into t_goals(goal_name) values ('Fun'), ('Tryhard'), ('Romantic Communication');
CREATE TABLE t_avatars(
    id BIGSERIAL PRIMARY KEY,
    bytes oid,
    content_type text,
    is_preview_image boolean,
    name text,
    original_file_name text,
    size bigint
);
CREATE TABLE t_user_information(
    id BIGSERIAL PRIMARY KEY,
    name text,
    surname text,
    birthdate date,
    gender text,
    discord text,
    email text,
    steam text,
    vk text,
    preview_avatar_id bigint REFERENCES t_avatars (id) on delete set NULL
);
CREATE TABLE t_user(
    id BIGSERIAL PRIMARY KEY,
    username text UNIQUE NOT NULL,
    password text NOT NULL,
    userinformation_id bigint REFERENCES t_user_information (id) ON DELETE SET NULL
);
CREATE TABLE t_ad(
    id BIGSERIAL PRIMARY KEY,
    date date not null,
    elo text,
    gender text,
    high_age_lvl integer,
    low_age_lvl integer,
    is_active boolean default true,
    tag text,
    text text,
    user_id bigint REFERENCES t_user(id) on delete cascade,
    game_id bigint REFERENCES  t_games(id) on delete set null,
    goal_id bigint REFERENCES  t_goals(id) on delete set null
);
CREATE TABLE t_user_roles (
    user_id bigint REFERENCES t_user (id) ON DELETE CASCADE,
    roles_id bigint REFERENCES t_role (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, roles_id)
);
CREATE TABLE t_dialogs(
    id BIGSERIAL PRIMARY KEY,
    user1_id bigint REFERENCES t_user (id) ON DELETE CASCADE,
    user2_id bigint REFERENCES t_user (id) ON DELETE CASCADE
);
CREATE TABLE t_messages(
    id BIGSERIAL PRIMARY KEY,
    date timestamp,
    is_read boolean,
    text text,
    user_id bigint references t_user(id) on delete cascade,
    dialog_id bigint references t_dialogs(id) on delete cascade
);
CREATE OR REPLACE function take_user_role()
returns trigger
as $$
BEGIN
    insert into t_user_roles(user_id, roles_id) values (new.id, 2);
    return new;
end;
$$ language plpgsql;
create trigger automaticallyRolled after insert on t_user
    for each row execute procedure take_user_role();