ALTER TABLE `products` MODIFY COLUMN `sellerPhone` varchar(32);--> statement-breakpoint
ALTER TABLE `seller_applications` MODIFY COLUMN `whatsapp` varchar(32);--> statement-breakpoint
ALTER TABLE `seller_applications` ADD `socialUrl` text;