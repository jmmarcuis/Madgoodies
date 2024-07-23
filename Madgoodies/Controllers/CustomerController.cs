using Microsoft.AspNetCore.Mvc;
using DataLibrary.CustomerModel;
using DataLibrary.Helper;
using DataLibrary.CustomerData;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerData _db;
        private readonly TokenService _tokenService;

        public CustomerController(ICustomerData db, TokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            if (model == null)
                return BadRequest("Invalid registration details");

            try
            {
                await _db.RegisterCustomerAsync(model);
                return Ok("Registration successful");
            }
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, "Internal server error");
            }
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticationModel model)
        {
            if (model == null)
                return BadRequest("Invalid authentication details");

            try
            {
                var customer = await _db.AuthenticateCustomerAsync(model.CustomerEmail, model.Password);
                if (customer != null)
                {
                    var token = _tokenService.GenerateToken(customer.UserName, customer.CustomerId);
                    return Ok(new { Token = token });
                }

                return Unauthorized("Invalid email or password");
            }
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("validate-token")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            return Ok(new { isValid = true });
        }
    }
}
