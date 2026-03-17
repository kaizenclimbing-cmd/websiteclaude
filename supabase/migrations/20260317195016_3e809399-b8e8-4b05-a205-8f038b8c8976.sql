SELECT pgmq.delete('transactional_emails', msg_id)
FROM pgmq.read('transactional_emails', 1, 100)
WHERE msg_id IN (11, 12, 13);