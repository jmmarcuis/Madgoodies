using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Socials.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstagramPostsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetPosts()
        {
            var posts = new List<object>
            {
                new { id = 1, media_url = "https://www.instagram.com/p/C7o4UK5SXTH/" },
                new { id = 2, media_url = "https://www.instagram.com/p/C66OWvOS5nM/", permalink = "#" },
                new { id = 3, media_url = "https://www.instagram.com/p/C4nNxWUBrAA/", permalink = "#" },
                new { id = 4, media_url = "https://www.instagram.com/p/C39wlFYhNNf/", permalink = "#" },
                new { id = 5, media_url = "https://www.instagram.com/p/C3zovWJByKP/", permalink = "#" },
                new { id = 6, media_url = "https://www.instagram.com/p/C3y4ytnBTmr/", permalink = "#" },
                new { id = 7, media_url = "https://www.instagram.com/p/C2rmC31hJxs/", permalink = "#" },
                new { id = 8, media_url = "https://www.instagram.com/stories/highlights/17999832257594405/", permalink = "#" }
            };

            return Ok(posts);
        }
    }
}
