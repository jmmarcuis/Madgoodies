CREATE PROCEDURE [dbo].[spGetUserById]
    @userId INT
AS
BEGIN
    SELECT Id, UserName, FirstName, LastName, Password
    FROM [dbo].[Users]
    WHERE Id = @userId
END
GO