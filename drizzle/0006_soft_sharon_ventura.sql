ALTER TABLE `seller_applications` MODIFY COLUMN `status` enum('pending','approved','rejected','suspended','expired') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `announcementText` text;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `isAnnouncementActive` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `isFeatured` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `seller_applications` ADD `expiresAt` timestamp;