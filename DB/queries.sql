SELECT * from PollOption;

-- SELECT a.OptionID, COUNT(*) as Votes, b.OptionText FROM PollAnswer AS a JOIN PollOption AS b ON a.OptionID = b.PollOptionId WHERE a.PollID=1 GROUP BY 1, 3 ORDER BY 2 DESC;

-- SELECT OptionID, COUNT(*) FROM PollAnswer WHERE PollID=2 GROUP BY 1 ORDER BY 2 DESC;

-- SELECT a.PollId, COUNT(*), b.QuestionText FROM PollAnswer AS a JOIN Poll AS b  ON a.PollID = b.PollID GROUP BY 1, 3 ORDER BY 2 DESC LIMIT 3;

-- SELECT QuestionText, COUNT(PollID) FROM PollAnswer JOIN Poll;  
-- SELECT UserId, COUNT(*) FROM Poll GROUP BY UserId;
-- SELECT OptionText, PollOptionId FROM PollOption WHERE PollId=1;
-- SELECT CommentID, Content, UserId, CreatedDate FROM Comment WHERE PollID=5;
-- SELECT * FROM Comment;

-- DROP TABLE PollAnswer;
-- CREATE TABLE PollAnswer (
--     PollAnswerId BIGINT AUTO_INCREMENT PRIMARY KEY,
--     PollId BIGINT,
--     OptionId BIGINT,
--     UserId BIGINT,
--     CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE (PollId, OptionId, UserId),
--     FOREIGN KEY (PollId) REFERENCES Poll(PollId) ON DELETE RESTRICT,
--     FOREIGN KEY (OptionId) REFERENCES PollOption(PollOptionId) ON DELETE RESTRICT,
--     FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE RESTRICT
-- );