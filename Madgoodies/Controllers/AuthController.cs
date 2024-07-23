using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using DataLibrary.CustomerModel;
using DataLibrary.Helper;
using DataLibrary.CustomerData;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Madgoodies.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;

        public AuthController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpGet("validate-token")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            // If this point is reached, it means the token is valid
            return Ok(new { isValid = true });
        }
    }
}
