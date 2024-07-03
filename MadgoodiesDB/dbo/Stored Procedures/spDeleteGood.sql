CREATE PROCEDURE [dbo].[spDeleteGood]
    @ProductID INT
AS
BEGIN
    DELETE FROM Goods
    WHERE ProductID = @ProductID
END
