CREATE TABLE [dbo].[CustomerInquiries]
(
    ID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    EmailAddress NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20),
    OrderNumber NVARCHAR(50),
    InquiryType NVARCHAR(10) NOT NULL CHECK (InquiryType IN ('product', 'shipping')),
    Message NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);