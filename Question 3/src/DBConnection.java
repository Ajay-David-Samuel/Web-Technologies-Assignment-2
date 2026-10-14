import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
  private static final String URL = "jdbc:mysql://localhost:3306/college_portal?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
  private static final String USER = "root";
  private static final String PASSWORD = ""; // Adjust password to match local MySQL setup

  static {
    try {
      Class.forName("com.mysql.cj.jdbc.Driver");
    } catch (ClassNotFoundException e) {
      System.err.println("MySQL JDBC Driver not found in classpath: " + e.getMessage());
    }
  }

  public static Connection getConnection() throws SQLException {
    return DriverManager.getConnection(URL, USER, PASSWORD);
  }
}
