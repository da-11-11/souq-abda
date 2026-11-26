CREATE TABLE `platform_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`maxFreeTrials` int NOT NULL DEFAULT 30,
	`isFreeTrialOpen` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `seller_applications` MODIFY COLUMN `planType` enum('free_trial','monthly','yearly') NOT NULL DEFAULT 'monthly';--> statement-breakpoint
ALTER TABLE `seller_applications` ADD `trialEndsAt` timestamp;