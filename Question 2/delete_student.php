<?php
require_once 'db.php';

$studentId = $_GET['id'] ?? null;
if (!$studentId || !is_numeric($studentId)) {
  header("Location: index.php?err=" . urlencode("Invalid Student ID"));
  exit;
}

try {
  $fileStmt = $pdo->prepare("SELECT file_path FROM student_documents WHERE student_id = ?");
  $fileStmt->execute([$studentId]);
  $files = $fileStmt->fetchAll();

  foreach ($files as $file) {
    $fullPath = __DIR__ . '/' . $file['file_path'];
    if (file_exists($fullPath) && is_file($fullPath)) {
      @unlink($fullPath);
    }
  }

  $delStmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
  $delStmt->execute([$studentId]);

  header("Location: index.php?msg=" . urlencode("Student record and associated files successfully deleted."));
  exit;
} catch (PDOException $e) {
  header("Location: index.php?err=" . urlencode("Failed to delete student: " . $e->getMessage()));
  exit;
}
?>
