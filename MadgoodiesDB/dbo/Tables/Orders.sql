CREATE TABLE [dbo].[Orders]
(
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    OrderDate DATETIME NOT NULL DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL,
    OrderStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    CONSTRAINT CHK_OrderStatus CHECK (OrderStatus IN ('Pending', 'Completed', 'Cancelled', 'Refunded'))
);
