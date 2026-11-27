CREATE TABLE `whatsapp_click_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`identityKey` varchar(191) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whatsapp_click_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsapp_click_events_identityKey_unique` UNIQUE(`identityKey`)
);
