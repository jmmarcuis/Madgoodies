CREATE PROCEDURE [dbo].[spDeleteOrder]
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Delete associated order details
        DELETE FROM OrderDetails WHERE OrderID = @OrderID;
        
        -- Delete the order
        DELETE FROM Orders WHERE OrderID = @OrderID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END