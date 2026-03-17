SELECT pgmq.delete('transactional_emails', 1::bigint);
SELECT pgmq.delete('transactional_emails', 2::bigint);