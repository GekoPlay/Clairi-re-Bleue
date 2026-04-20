<?php
function PutFamilyFiFo(PDO $conn, array $data): bool {
    $requiredFields = ['id_famille', 'id_activite', 'nb_membre'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            error_log("[PutFamilyFiFo] Champ manquant : $field");
            return false;
        }
    }

    $sql = "INSERT INTO reservation_activites (id_famille, id_activite, nb_membre, date_inscription) 
            VALUES (:id_famille, :id_activite, :nb_membre, :date_inscription)";

    try {
        $stmt = $conn->prepare($sql);

        $stmt->bindValue(':id_famille',       (int) $data['id_famille'],  PDO::PARAM_INT);
        $stmt->bindValue(':id_activite',      (int) $data['id_activite'], PDO::PARAM_INT);
        $stmt->bindValue(':nb_membre',        (int) $data['nb_membre'],   PDO::PARAM_INT);
        $stmt->bindValue(':date_inscription', date('Y-m-d H:i:s'),        PDO::PARAM_STR);

        return $stmt->execute();

    } catch (PDOException $e) {
        error_log('[PutFamilyFiFo] Erreur PDO : ' . $e->getMessage());
        return false;
    }
}