CREATE PROCEDURE [dbo].[spGetUsers]
AS
BEGIN
    SELECT 
        u.UserName,
        u.FirstName,
        u.LastName,
        u.Password
    FROM 
        Users u
END