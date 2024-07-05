using DataLibrary.Data;
using DataLibrary.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoodController : ControllerBase
    {
        private readonly ISqlData _db;
        private readonly Cloudinary _cloudinary;

        public GoodController(ISqlData db, Cloudinary cloudinary)
        {
            _db = db;
            _cloudinary = cloudinary;
        }


        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddGood([FromForm] CreateGood good, [FromForm] IFormFile productImage)
        {
            try
            {
                string imageUrl = null;

                if (productImage != null)
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(productImage.FileName, productImage.OpenReadStream()),
                        Transformation = new Transformation().Crop("fill").Gravity("face")
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    imageUrl = uploadResult.SecureUrl.ToString();
                }

                Console.WriteLine($"Adding Good: ImageUrl={imageUrl}, ProductName={good.ProductName}, Price={good.Price}, Stock={good.Stock}, Description={good.Description}");

                // Ensure the correct field is used for the image URL
                _db.AddGood(imageUrl, good.ProductName, good.Price, good.Stock, good.Description);
                return Ok("Good added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        [HttpGet]
        [Route("all")]
        public IActionResult GetAllGoods()
        {
            try
            {
                IEnumerable<ListGoods> goods = _db.GetAllGoods();
                foreach (var good in goods)
                {
                    Console.WriteLine($"Retrieved Good: ProductID={good.ProductID}, ProductImageUrl={good.ProductImageUrl}, ProductName={good.ProductName}, Price={good.Price}, Stock={good.Stock}, Description={good.Description}");
                }
                return Ok(goods);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteGood(int id)
        {
            try
            {
                // Retrieve the good details
                var good = _db.GetGoodById(id);
                if (good == null)
                {
                    return NotFound("Good not found");
                }

                // Delete the image from Cloudinary
                var publicId = GetPublicIdFromUrl(good.ProductImageUrl);
                if (!string.IsNullOrEmpty(publicId))
                {
                    var deletionParams = new DeletionParams(publicId);
                    var deletionResult = await _cloudinary.DestroyAsync(deletionParams);

                    if (deletionResult.Result != "ok")
                    {
                        return StatusCode(500, "Failed to delete image from Cloudinary");
                    }
                }

                // Perform the soft delete
                _db.DeleteGood(id);
                return Ok("Good deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to extract publicId from the image URL
        private string GetPublicIdFromUrl(string url)
        {
            var uri = new Uri(url);
            var segments = uri.Segments;
            var filename = segments[segments.Length - 1];
            var publicId = filename.Substring(0, filename.LastIndexOf('.'));
            return publicId;
        }


        [HttpPut]
        [Route("{id}")]
        public IActionResult UpdateGood(int id, [FromBody] UpdateGood good)
        {
            try
            {
                if (good == null)
                {
                    return BadRequest("Good data is missing.");
                }

                if (string.IsNullOrWhiteSpace(good.ProductName))
                {
                    return BadRequest("Product name is required.");
                }

                if (good.Price <= 0)
                {
                    return BadRequest("Price must be greater than zero.");
                }

                if (good.Stock < 0)
                {
                    return BadRequest("Stock cannot be negative.");
                }

                Console.WriteLine($"Updating Good: ID={id}, ProductName={good.ProductName}, Price={good.Price}, Stock={good.Stock}, Description={good.Description}");

                _db.UpdateGoodDetails(id, good.ProductName, good.Price, good.Stock, good.Description);
                return Ok(new { message = "Good updated successfully", updatedGood = good });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut]
        [Route("{id}/image")]
        public async Task<IActionResult> UpdateGoodImage(int id, IFormFile productImage)
        {
            try
            {
                if (productImage == null)
                {
                    return BadRequest("No image file provided.");
                }

                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(productImage.FileName, productImage.OpenReadStream()),
                    Transformation = new Transformation().Crop("fill").Gravity("face")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                string imageUrl = uploadResult.SecureUrl.ToString();

                Console.WriteLine($"Updating Good Image: ID={id}, ImageUrl={imageUrl}");

                _db.UpdateGoodImage(id, imageUrl);
                return Ok(new { message = "Good image updated successfully", imageUrl = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Internal server error: {ex.Message}" });
            }
        }
    

    }
}
