CREATE PROCEDURE spInsertOrder
    @TotalAmount DECIMAL(10,2),
    @IsFulfilled BIT
AS
BEGIN
    INSERT INTO Orders (TotalAmount, IsFulfilled)
    VALUES (@TotalAmount, @IsFulfilled);

    SELECT SCOPE_IDENTITY() AS OrderID;
END
