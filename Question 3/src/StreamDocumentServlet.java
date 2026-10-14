import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class StreamDocumentServlet extends HttpServlet {
  private static final int BUFFER_SIZE = 8192;

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {

    HttpSession session = request.getSession(false);
    if (session == null || session.getAttribute("user") == null) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Denied: Please log in.");
      return;
    }

    String docIdStr = request.getParameter("id");
    if (docIdStr == null || docIdStr.trim().isEmpty()) {
      response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Document ID parameter is missing.");
      return;
    }

    Connection conn = null;
    PreparedStatement stmt = null;
    ResultSet rs = null;

    try {
      int docId = Integer.parseInt(docIdStr.trim());
      conn = DBConnection.getConnection();
      String sql = "SELECT file_name, file_path, file_type, file_size FROM student_documents WHERE id = ?";
      stmt = conn.prepareStatement(sql);
      stmt.setInt(1, docId);
      rs = stmt.executeQuery();

      if (!rs.next()) {
        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Document record not found in database.");
        return;
      }

      String fileName = rs.getString("file_name");
      String filePath = rs.getString("file_path");
      String fileType = rs.getString("file_type");

      File file = new File(getServletContext().getRealPath("/") + filePath);
      if (!file.exists()) {
        file = new File(filePath);
      }

      if (!file.exists() || !file.isFile()) {
        response.sendError(HttpServletResponse.SC_NOT_FOUND, "File does not exist on server storage.");
        return;
      }

      response.setContentType(fileType != null ? fileType : "application/octet-stream");
      response.setContentLengthLong(file.length());

      boolean isImage = fileType != null && fileType.startsWith("image/");
      String disposition = isImage ? "inline" : "inline; filename=\"" + fileName + "\"";
      response.setHeader("Content-Disposition", disposition);

      try (FileInputStream inStream = new FileInputStream(file);
           OutputStream outStream = response.getOutputStream()) {
        
        byte[] buffer = new byte[BUFFER_SIZE];
        int bytesRead = -1;

        while ((bytesRead = inStream.read(buffer)) != -1) {
          outStream.write(buffer, 0, bytesRead);
        }
        outStream.flush();
      }

    } catch (NumberFormatException e) {
      response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid Document ID format.");
    } catch (Exception e) {
      e.printStackTrace();
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error streaming file: " + e.getMessage());
    } finally {
      try { if (rs != null) rs.close(); } catch (Exception ignored) {}
      try { if (stmt != null) stmt.close(); } catch (Exception ignored) {}
      try { if (conn != null) conn.close(); } catch (Exception ignored) {}
    }
  }
}
