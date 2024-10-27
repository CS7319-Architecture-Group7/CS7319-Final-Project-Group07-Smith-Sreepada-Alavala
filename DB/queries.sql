-- SELECT PollId, COUNT(*) FROM PollAnswer GROUP BY PollId;
-- SELECT UserId, COUNT(*) FROM Poll GROUP BY UserId;
-- SELECT OptionText, PollOptionId FROM PollOption WHERE PollId=1;
-- SELECT CommentID, Content, UserId, CreatedDate FROM Comment WHERE PollID=5;
SELECT * FROM Comment;

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