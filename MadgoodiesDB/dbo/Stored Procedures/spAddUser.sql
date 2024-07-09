CREATE PROCEDURE [dbo].[spAddUser]
    @username NVARCHAR(16),
    @firstName NVARCHAR(50),
    @lastName NVARCHAR(50),
    @password NVARCHAR(16)
AS
BEGIN
    INSERT INTO [dbo].[Users] (UserName, FirstName, LastName, Password)
    VALUES (@username, @firstName, @lastName, @password)
END
GO