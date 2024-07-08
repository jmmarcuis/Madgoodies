CREATE PROCEDURE [dbo].[spDeleteUser]
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Users
    WHERE Id = @UserId;
END