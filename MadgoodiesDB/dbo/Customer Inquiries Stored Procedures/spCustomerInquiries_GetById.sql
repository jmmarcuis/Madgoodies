CREATE PROCEDURE [dbo].[spCustomerInquiries_GetById]
    @ID INT
AS
BEGIN
    SELECT *
    FROM [dbo].[CustomerInquiries]
    WHERE ID = @ID;
END