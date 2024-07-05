CREATE PROCEDURE spUpdateProductStock
    @ProductID INT,
    @Quantity INT
AS
BEGIN
    UPDATE Goods
    SET Stock = Stock - @Quantity
    WHERE ProductID = @ProductID;
END
