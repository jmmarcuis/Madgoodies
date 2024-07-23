CREATE PROCEDURE [dbo].[spCustomerInquiries_Insert]
(
  @FirstName NVARCHAR(50),
  @LastName NVARCHAR(50),
  @EmailAddress NVARCHAR(100),
  @PhoneNumber NVARCHAR(20) = NULL,
  @OrderNumber NVARCHAR(50) = NULL,
  @InquiryType NVARCHAR(50),
  @Message NVARCHAR(MAX)
)
AS
BEGIN
  INSERT INTO CustomerInquiries (FirstName, LastName, EmailAddress, PhoneNumber, OrderNumber, InquiryType, Message)
  VALUES (@FirstName, @LastName, @EmailAddress, @PhoneNumber, @OrderNumber, @InquiryType, @Message);  -- Closing parenthesis here
END;  
