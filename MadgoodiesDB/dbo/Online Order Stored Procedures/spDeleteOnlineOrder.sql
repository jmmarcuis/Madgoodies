CREATE PROCEDURE [dbo].[spDeleteOnlineOrder]
  @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Delete associated order details
        DELETE FROM OrderItems WHERE OrderID = @OrderID;
        
        -- Delete the order
        DELETE FROM OnlineOrders WHERE OrderID = @OrderID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END