CREATE PROCEDURE [dbo].[spGetUsers]
AS
BEGIN
    SELECT 
        UserName,
        FirstName,
        LastName,
        Password
    FROM 
        Users
END