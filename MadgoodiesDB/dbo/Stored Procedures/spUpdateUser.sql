CREATE PROCEDURE [dbo].[spUpdateUser]
    @userId INT,
    @username NVARCHAR(16),
    @firstName NVARCHAR(50),
    @lastName NVARCHAR(50),
    @password NVARCHAR(16)
AS
BEGIN
    UPDATE [dbo].[Users]
    SET UserName = @username,
        FirstName = @firstName,
        LastName = @lastName,
        Password = @password
    WHERE Id = @userId
END
GO