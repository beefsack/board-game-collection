CREATE TABLE users (
    id            UUID         NOT NULL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(500) NOT NULL,
    role          VARCHAR(50)  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL,
    updated_at    TIMESTAMPTZ  NOT NULL
);

CREATE TABLE designers (
    id         UUID         NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL,
    updated_at TIMESTAMPTZ  NOT NULL
);

CREATE TABLE publishers (
    id         UUID         NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL,
    updated_at TIMESTAMPTZ  NOT NULL
);

CREATE TABLE board_games (
    id                UUID         NOT NULL PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    year_published    INTEGER,
    min_players       INTEGER,
    max_players       INTEGER,
    play_time_minutes INTEGER,
    weight            DECIMAL(3, 2),
    created_at        TIMESTAMPTZ  NOT NULL,
    updated_at        TIMESTAMPTZ  NOT NULL
);

CREATE INDEX board_games_title_idx ON board_games (title);

CREATE TABLE board_game_designers (
    board_game_id UUID NOT NULL REFERENCES board_games (id) ON DELETE CASCADE,
    designer_id   UUID NOT NULL REFERENCES designers (id) ON DELETE CASCADE,
    PRIMARY KEY (board_game_id, designer_id)
);

CREATE TABLE board_game_publishers (
    board_game_id UUID NOT NULL REFERENCES board_games (id) ON DELETE CASCADE,
    publisher_id  UUID NOT NULL REFERENCES publishers (id) ON DELETE CASCADE,
    PRIMARY KEY (board_game_id, publisher_id)
);

CREATE TABLE user_board_games (
    id            UUID        NOT NULL PRIMARY KEY,
    user_id       UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    board_game_id UUID        NOT NULL REFERENCES board_games (id) ON DELETE CASCADE,
    condition     VARCHAR(50),
    created_at    TIMESTAMPTZ NOT NULL,
    updated_at    TIMESTAMPTZ NOT NULL,
    UNIQUE (user_id, board_game_id)
);
