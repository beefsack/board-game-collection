ALTER TABLE board_games RENAME COLUMN play_time_minutes TO min_play_time_minutes;
ALTER TABLE board_games ADD COLUMN max_play_time_minutes INTEGER;
ALTER TABLE board_games ADD COLUMN rating DECIMAL(3, 1);
