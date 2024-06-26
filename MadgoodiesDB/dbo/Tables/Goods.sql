CREATE TABLE [dbo].[Goods]
(
  ProductID INT NOT NULL PRIMARY KEY,
  [ProductName] VARCHAR(100) NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  Stock INT NOT NULL,
  [Description] TEXT NOT NULL
)
