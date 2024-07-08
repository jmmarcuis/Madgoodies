CREATE PROCEDURE [dbo].[spSuperAdmin_Authenticate]
@username nvarchar(16),
@password nvarchar(16)
AS
begin
set nocount on;

SELECT [Id],[UserName], [FirstName],[LastName], [Password]
FROM dbo.SuperAdmin
WHERE UserName = @username
AND Password = @password;
end
