import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class StudentListServlet extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    
    HttpSession session = request.getSession(false);
    if (session == null || session.getAttribute("user") == null) {
      response.sendRedirect("login.jsp?error=Access+denied.+Please+login+first.");
      return;
    }

    List<Map<String, Object>> studentList = new ArrayList<>();
    Connection conn = null;
    PreparedStatement stmt = null;
    ResultSet rs = null;

    try {
      conn = DBConnection.getConnection();
      String sql = "SELECT s.id AS student_id, s.name, s.roll_no, s.email, s.course, s.created_at, " +
                   "       d1.id AS photo_doc_id, d1.file_name AS photo_name, " +
                   "       d2.id AS cert_doc_id, d2.file_name AS cert_name, d2.file_type AS cert_type " +
                   "FROM students s " +
                   "LEFT JOIN student_documents d1 ON s.id = d1.student_id AND d1.doc_category = 'profile_image' " +
                   "LEFT JOIN student_documents d2 ON s.id = d2.student_id AND d2.doc_category != 'profile_image' " +
                   "ORDER BY s.id DESC";

      stmt = conn.prepareStatement(sql);
      rs = stmt.executeQuery();

      while (rs.next()) {
        Map<String, Object> map = new HashMap<>();
        map.put("student_id", rs.getInt("student_id"));
        map.put("name", rs.getString("name"));
        map.put("roll_no", rs.getString("roll_no"));
        map.put("email", rs.getString("email"));
        map.put("course", rs.getString("course"));
        map.put("created_at", rs.getString("created_at"));
        
        map.put("photo_doc_id", rs.getObject("photo_doc_id"));
        map.put("photo_name", rs.getString("photo_name"));
        map.put("cert_doc_id", rs.getObject("cert_doc_id"));
        map.put("cert_name", rs.getString("cert_name"));
        map.put("cert_type", rs.getString("cert_type"));

        studentList.add(map);
      }

      request.setAttribute("studentList", studentList);
      RequestDispatcher dispatcher = request.getRequestDispatcher("students.jsp");
      dispatcher.forward(request, response);

    } catch (Exception e) {
      e.printStackTrace();
      request.setAttribute("errorMessage", "Database retrieval error: " + e.getMessage());
      RequestDispatcher dispatcher = request.getRequestDispatcher("students.jsp");
      dispatcher.forward(request, response);
    } finally {
      try { if (rs != null) rs.close(); } catch (Exception ignored) {}
      try { if (stmt != null) stmt.close(); } catch (Exception ignored) {}
      try { if (conn != null) conn.close(); } catch (Exception ignored) {}
    }
  }
}
