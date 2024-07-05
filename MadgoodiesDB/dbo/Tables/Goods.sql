﻿CREATE TABLE [dbo].[Goods]
(
  ProductID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  ProductImageUrl VARCHAR(MAX) NOT NULL,
  ProductName VARCHAR(100) NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  Stock INT NOT NULL,
  Description TEXT NOT NULL,
  IsDeleted BIT NOT NULL DEFAULT 0,
);
