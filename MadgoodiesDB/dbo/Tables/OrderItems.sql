CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    ProductName NVARCHAR(255) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL,
    PackagingID INT NULL,
    PackageQuantity INT NULL,
    FOREIGN KEY (OrderID) REFERENCES OnlineOrders(OrderID)
);