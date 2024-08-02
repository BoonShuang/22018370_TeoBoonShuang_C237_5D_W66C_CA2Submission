USE 'boonshuang_skincare_app_db';

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `reviewID` int(11) NOT NULL,
  `review_username` varchar(100) NOT NULL,
  `productID` int(11) NOT NULL,
  `comment` varchar(500) NOT NULL,
  `rating` varchar(5) NOT NULL,
  `review_image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skincare_product`
--

CREATE TABLE `skincare_product` (
  `productID` int(11) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `productName` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `averageRating` varchar(1) DEFAULT '0',
  `image` varchar(255) DEFAULT NULL,
  `productType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skincare_product`
--

INSERT INTO `skincare_product` (`productID`, `brand`, `productName`, `description`, `averageRating`, `image`, `productType`) VALUES
(53, 'FIRST AID BEAUTY', 'Face Cleanser', 'This Face Cleanser gently cleanses the skin, removing surface oils, makeup, dirt, and grime—and its whipped texture transforms into a rich cream when blended with water. It is infused with a powerful botanical antioxidant blend that works hard to block damaging free radicals.', '4', 'closeup_1_Product_851939002500-First-Aid-Beauty-Face-Cleanser-56-7g_9a9e777cae171694df5760cc17091f093d6a065a_1710237227.webp', 'cleanser'),
(54, 'SHISEIDO', 'Face Cleanser', 'A rich, fine-textured 2-in-1 foaming face wash that doubles as a shaving cream to clean, refresh, and energise the skin.', '3', 'closeup_1_Product_729238171527-Shiseido-Face-Cleanser-125ml_340f3f4d4e9a08323c28f92851792e2d9079458f_1616665718.webp', 'cleanser'),
(55, 'DRGL', 'Moisturiser All Skin Types', 'The DrGL Moisturiser All Skin Types is a lightweight, dual-action product that provides skin with nourishing benefits. Not only does it moisturise, it also protects skin against photo-ageing, minimise the appearance of fine lines, and keep skin soft and supple. It is infused with Hyaluronic Acid and Vitamin C that actively rejuvenate the skin and fight damage from free radicals, respectively.', '5', 'closeup_drglmoisturiser180625_a06663724da418e5535b52a20a903e0b9e9da27a_1552898490.webp', 'moisturizer'),
(56, 'INNISFREE', 'Black Tea Youth Enhancing Treatment Essence', 'An anti-ageing water essence that helps to smoothen, revitalise and boost your skin\'s radiance.', '1', 'closeup_1_Product_8809843694542-Innisfree-Black-Tea-Youth-Enhancing-_77fb126e87003ad058b140715120f25f1d800f7e_1710330247.webp', 'toner'),
(57, 'INNISFREE', 'Green Tea Seed Hyaluronic Serum', 'A hydrating serum that absorbs instantly with Beauty Green Tea and encapsulated hyaluronic acid to keep skin moisturised for 72 hours for plump and glowing skin.', '2', 'closeup_1_Product_8809843694085-Innisfree-Green-Tea-Seed-Hyaluronic-_bbcaaddf55325252cd781d33b551679b5ff2e1d2_1710330244.webp', 'serum'),
(58, 'SUPERGOOP!', 'Unseen Sunscreen Broad Spectrum Sunscreen SPF 40 PA+++', 'A totally invisible, weightless, scentless, makeup-gripping, daily primer with SPF 40.', '3', 'closeup_1_Product_816218029227-Supergoop-Unseen-Sunscreen-Broad-Spec_9debaf4038df1312acdbd57613bfd449090cbf2f_1708938025.webp', 'sunscreen'),
(59, ' SUPERGOOP!', 'Protec(Tint) Sunscreen SPF 50 PA++++ • 35ml', 'An effortless, lightweight skin tint meets powerful sun protection with light, buildable coverage and a natural finish for immediately smooth, even-looking skin.', '4', 'closeup_1_Product_816218026967-Supergoop-ProtecTint-SPF-50-14N_5f614b20d279df18a7e84e203066b9e3fc4772e8_1708947900.webp', 'sunscreen'),
(60, 'INDIE LEE', 'Clearing Mask', 'Deep cleanse and nourish the complexion with this gentle yet effective treatment mask. Salicylic and Glycolic Acids work to exfoliate dead skin cells. Bentonite Clay and Colloidal Sulfur help to gently draw out impurities. Zinc Oxide, Chamomile and Red Seaweed extracts ensure skin is left reconditioned and hydrated.', '3', 'closeup_1_Product_811239030757-Indie-Lee-Clearing-Mask-50g_e37f821132e62b9705ddd148beacbc651fc586dc_1709001114.webp', 'mask'),
(61, 'INNISFREE', 'Super Volcanic Pore Clay Mask', 'A creamy and cooling clay mask with powerful 98% absorption of excess sebum with just one use.', '2', 'closeup_1_Product_8809843695020-Innisfree-Super-Volcanic-Pore-Clay-M_4f24495b9fce62aab58278e0b81211af7869a33e_1713787691.webp', 'mask');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(20) NOT NULL,
  `loggedIn` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `username`, `password`, `loggedIn`) VALUES
(1, 'root', 'pw', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`reviewID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `skincare_product`
--
ALTER TABLE `skincare_product`
  ADD PRIMARY KEY (`productID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `reviewID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `skincare_product`
--
ALTER TABLE `skincare_product`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `skincare_product` (`productID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
