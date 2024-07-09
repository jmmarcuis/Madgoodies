CREATE PROCEDURE [dbo].[spDeleteUser]
    @userId INT
AS
BEGIN
    DELETE FROM [dbo].[Users]
    WHERE Id = @userId
END
GO