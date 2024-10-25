-- Create a new database user
CREATE USER 'cs7319'@'localhost' IDENTIFIED BY 'archproject123';

-- Create the PollManagement database
CREATE DATABASE PollManagement;

-- Grant permissions to the cs7319 user on the PollManagement database
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON PollManagement.* TO 'cs7319'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Use the PollManagement database
USE PollManagement;

-- Create User Table
CREATE TABLE User (
    UserId BIGINT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(200) NOT NULL,
    LastName VARCHAR(200) NOT NULL,
    EmailID VARCHAR(200) NOT NULL UNIQUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PassCode Table
CREATE TABLE PassCode (
    PassCodeId BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserId BIGINT,
    Code VARCHAR(8) NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpirationDateTime DATETIME NOT NULL,    
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE SET NULL
);

-- Create Poll Table
CREATE TABLE Poll (
    PollId BIGINT AUTO_INCREMENT PRIMARY KEY,
    QuestionText TEXT NOT NULL,
    UserId BIGINT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    BeginDateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    ExpirationDateTime DATETIME NOT NULL,
    CommentsVisible BOOLEAN DEFAULT 'TRUE',
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE SET NULL
);

-- Create PollOption Table
CREATE TABLE PollOption (
    PollOptionId BIGINT AUTO_INCREMENT PRIMARY KEY,
    PollId BIGINT,
    OptionText VARCHAR(255) NOT NULL,
    UNIQUE (PollId, PollOptionId),
    FOREIGN KEY (PollId) REFERENCES Poll(PollId) ON DELETE RESTRICT
);

-- Create PollAnswer Table
CREATE TABLE PollAnswer (
    PollAnswerId BIGINT AUTO_INCREMENT PRIMARY KEY,
    PollId BIGINT,
    OptionId BIGINT,
    UserId BIGINT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (PollId, OptionId, UserId),
    FOREIGN KEY (PollId) REFERENCES Poll(PollId) ON DELETE RESTRICT,
    FOREIGN KEY (OptionId) REFERENCES PollOption(PollOptionId) ON DELETE RESTRICT,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE RESTRICT
);

-- Create Comment Table
CREATE TABLE Comment (
    CommentId BIGINT AUTO_INCREMENT PRIMARY KEY,
    PollId BIGINT,
    UserId BIGINT,
    Content TEXT NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PollId) REFERENCES Poll(PollId) ON DELETE RESTRICT,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX idx_poll_createdby ON Poll(UserId);
CREATE INDEX idx_pollanswer_user ON PollAnswer(UserId);