CREATE PROCEDURE [dbo].[spGetUsers]
AS
BEGIN
    SELECT 
    Id,
        UserName,
        FirstName,
        LastName,
        Password
    FROM 
        Users
END