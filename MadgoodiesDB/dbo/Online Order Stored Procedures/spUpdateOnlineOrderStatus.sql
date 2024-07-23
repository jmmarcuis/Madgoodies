CREATE PROCEDURE [dbo].[spUpdateOnlineOrderStatus]
    @OrderID INT,
    @NewStatus NVARCHAR(20)
AS
BEGIN
    DECLARE @OldStatus NVARCHAR(20)

    -- Get the current status
    SELECT @OldStatus = OrderStatus
    FROM OnlineOrders
    WHERE OrderID = @OrderID

    -- Update the order status
    UPDATE OnlineOrders
    SET OrderStatus = @NewStatus
    WHERE OrderID = @OrderID;

    -- Handle stock changes
    IF @NewStatus = 'Completed' AND @OldStatus != 'Completed'
    BEGIN
        -- Decrease stock when order is completed
        UPDATE Goods
        SET Stock = Goods.Stock - OrderItems.Quantity
        FROM Goods
        INNER JOIN OrderItems ON Goods.ProductID = OrderItems.ProductID
        WHERE OrderItems.OrderID = @OrderID;
    END
    ELSE IF (@NewStatus IN ('Cancelled', 'Refunded')) AND @OldStatus = 'Completed'
    BEGIN
        -- Increase stock when a completed order is cancelled or refunded
        UPDATE Goods
        SET Stock = Goods.Stock + OrderItems.Quantity
        FROM Goods
        INNER JOIN OrderItems ON Goods.ProductID = OrderItems.ProductID
        WHERE OrderItems.OrderID = @OrderID;
    END
END