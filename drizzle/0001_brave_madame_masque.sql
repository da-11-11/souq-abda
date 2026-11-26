ALTER TABLE `seller_applications` ADD `planType` enum('monthly','yearly') DEFAULT 'monthly' NOT NULL;--> statement-breakpoint
ALTER TABLE `seller_applications` ADD `receiptUrl` text NOT NULL;--> statement-breakpoint
ALTER TABLE `seller_applications` ADD `senderAccountName` varchar(160) NOT NULL;--> statement-breakpoint
ALTER TABLE `seller_applications` ADD `referenceNumber` varchar(120);