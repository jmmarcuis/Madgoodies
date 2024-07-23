CREATE PROCEDURE [dbo].[spCustomerInquiries_GetAll]
AS
BEGIN
    SELECT *
    FROM [dbo].[CustomerInquiries]
    ORDER BY CreatedAt DESC;
END