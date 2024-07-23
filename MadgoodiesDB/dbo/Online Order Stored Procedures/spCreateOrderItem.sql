CREATE PROCEDURE [dbo].[spCreateOrderItem]
    @OrderID INT,
    @ProductID INT,
    @ProductName NVARCHAR(255),
    @Price DECIMAL(18,2),
    @Quantity INT,
    @PackagingID INT = NULL,
    @PackageQuantity INT = NULL
AS
BEGIN
    INSERT INTO OrderItems (OrderID, ProductID, ProductName, Price, Quantity, PackagingID, PackageQuantity)
    VALUES (@OrderID, @ProductID, @ProductName, @Price, @Quantity, @PackagingID, @PackageQuantity);
END
