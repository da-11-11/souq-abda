CREATE TABLE `slot_upgrade_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerApplicationId` int NOT NULL,
	`planType` enum('single','bundle') NOT NULL,
	`requestedSlots` int NOT NULL,
	`amount` varchar(32) NOT NULL,
	`receiptUrl` text NOT NULL,
	`senderAccountName` varchar(160) NOT NULL,
	`referenceNumber` varchar(120),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `slot_upgrade_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `whatsappClicks` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `likesCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `seller_applications` ADD `maxProducts` int DEFAULT 5 NOT NULL;