namespace DataLibrary.Database
{
    public interface ISqlDataAccess
    {
        List<T> LoadData<T, U>(string sqlStatement, U parameters, string connectionStringName, bool isStoredProcedure);
        Task<List<T>> LoadDataAsync<T, U>(string sqlStatement, U parameters, string connectionStringName, bool isStoredProcedure);
        void SaveData<T>(string sqlStatement, T parameters, string connectionStringName, bool isStoredProcedure);
        Task SaveDataAsync<T>(string sqlStatement, T parameters, string connectionStringName, bool isStoredProcedure = true);
    }
}
