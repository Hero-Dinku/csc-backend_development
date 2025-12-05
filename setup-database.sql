-- Add account_type column to account table
DO \$\$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='account' AND column_name='account_type'
    ) THEN
        ALTER TABLE account 
        ADD COLUMN account_type VARCHAR(50) DEFAULT 'Client' 
        CHECK (account_type IN ('Client', 'Employee', 'Admin'));
        RAISE NOTICE 'Added account_type column';
    ELSE
        RAISE NOTICE 'account_type column already exists';
    END IF;
END
\$\$;

-- Insert test accounts (password for all: Test123!)
-- Hash: \\\
INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
SELECT 'Admin', 'User', 'admin@test.com', '\\\', 'Admin'
WHERE NOT EXISTS (SELECT 1 FROM account WHERE account_email = 'admin@test.com');

INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
SELECT 'Employee', 'User', 'employee@test.com', '\\\', 'Employee'
WHERE NOT EXISTS (SELECT 1 FROM account WHERE account_email = 'employee@test.com');

INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
SELECT 'Client', 'User', 'client@test.com', '\\\', 'Client'
WHERE NOT EXISTS (SELECT 1 FROM account WHERE account_email = 'client@test.com');

-- Show all accounts
SELECT 
    account_id,
    account_firstname || ' ' || account_lastname as full_name,
    account_email,
    account_type
FROM account 
ORDER BY account_type;
