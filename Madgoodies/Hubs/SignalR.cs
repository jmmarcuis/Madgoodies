using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace GoodsHub.Hubs
{
    public class FetchGoodHub : Hub
    {
         public async Task SendUpdateMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
