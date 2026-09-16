const { PrismaClient } = require('C:/hgmer-backend/node_modules/@prisma/client');
const bcrypt = require('C:/hgmer-backend/node_modules/bcrypt');

const prisma = new PrismaClient();

async function seed() {
  console.log('--- SEEDING COMPLETE BACKEND DATABASE ---');

  // 1. Vendor & User
  let vendorUser = await prisma.user.findFirst({ where: { email: 'vendor@hargharmandir.com' } });
  if (!vendorUser) {
    const hash = await bcrypt.hash('vendor123', 10);
    vendorUser = await prisma.user.create({
      data: {
        name: 'श्री काशी वैदिक सामग्रालय',
        email: 'vendor@hargharmandir.com',
        phone: '9876543200',
        passwordHash: hash,
        role: 'VENDOR',
        vendorProfile: {
          create: {
            businessName: 'हर घर मंदिर प्रामाणिक सामग्री',
            gstNumber: '09AAACH7409R1ZZ',
            status: 'APPROVED'
          }
        }
      }
    });
  }
  const vendor = await prisma.vendorProfile.findFirst({ where: { userId: vendorUser.id } });

  // 2. Warehouse
  let warehouse = await prisma.warehouse.findFirst();
  if (!warehouse) {
    warehouse = await prisma.warehouse.create({
      data: {
        name: 'काशी मुख्य गोदाम (Main Warehouse)',
        address: 'बाबतपुर, वाराणसी, उत्तर प्रदेश',
        pincode: '221006'
      }
    });
  }

  // 3. Categories
  const categoriesList = [
    { name: 'दैनिक पूजा सामग्री', iconUrl: '/puja_thali.jpeg', isFestival: false },
    { name: 'सम्पूर्ण पूजा किट (Combo)', iconUrl: '/havan_set.jpeg', isFestival: false },
    { name: 'पीतल व तांबा बर्तन', iconUrl: '/kalash_with_coco.jpeg', isFestival: false },
    { name: 'पवित्र मूर्तियाँ व विग्रह', iconUrl: '/ganesha.jpeg', isFestival: false },
    { name: 'धूप, अगरबत्ती व इत्र', iconUrl: '/chandal_thali.jpeg', isFestival: false },
    { name: 'त्यौहार विशेष संग्रह', iconUrl: '/pooja_items.jpeg', isFestival: true },
    { name: 'धार्मिक पुस्तकें व ग्रंथ', iconUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&fit=crop', isFestival: false },
    { name: 'प्रसाद एवं भोग सामग्री', iconUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&fit=crop', isFestival: false }
  ];

  const dbCategories = [];
  for (const cat of categoriesList) {
    let existing = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!existing) {
      existing = await prisma.category.create({ data: cat });
    }
    dbCategories.push(existing);
  }

  // 4. Products
  const productsData = [
    {
      name: 'सत्यनारायण महापूजा सम्पूर्ण किट (All-in-One Box)',
      description: 'सत्यनारायण कथा के लिए आवश्यक सभी 32 शुद्ध सामग्रियां, कथा पुस्तक, हवन सामग्री, पीला वस्त्र व पंचमेवा सहित।',
      price: 899,
      mrp: 1299,
      rating: 4.9,
      reviewCount: 428,
      stock: 50,
      type: 'BUNDLE',
      weight: 1.8,
      unit: 'kg',
      imageUrl: '/havan_set.jpeg',
      categoryId: dbCategories[1].id,
      vendorId: vendor.id,
      status: 'APPROVED'
    },
    {
      name: 'हस्तनिर्मित शुद्ध पीतल नक्काशीदार पूजा थाली सेट (8 पीस)',
      description: 'पारंपरिक नक्काशीदार शुद्ध पीतल थाली, दिया, घंटी, कलश, अगरबत्ती स्टैंड, कुमकुम कटोरी व चम्मच युक्त।',
      price: 1450,
      mrp: 2199,
      rating: 4.8,
      reviewCount: 312,
      stock: 35,
      type: 'STANDARD',
      weight: 0.95,
      unit: 'kg',
      imageUrl: '/puja_thali.jpeg',
      categoryId: dbCategories[2].id,
      vendorId: vendor.id,
      status: 'APPROVED'
    },
    {
      name: 'भीमसेनी शुद्ध कपूर (100% ओरिजिनल औषधीय कपूर 250g)',
      description: 'धुआं रहित, पूर्णतः प्राकृतिक व बिना किसी मिलावट का शुद्ध भीमसेनी कपूर जो वातावरण को शुद्ध व सकारात्मक बनाता है।',
      price: 349,
      mrp: 499,
      rating: 4.9,
      reviewCount: 890,
      stock: 150,
      type: 'STANDARD',
      weight: 250,
      unit: 'g',
      imageUrl: '/pooja_items.jpeg',
      categoryId: dbCategories[0].id,
      vendorId: vendor.id,
      status: 'APPROVED'
    },
    {
      name: 'पंचमुखी शुद्ध पीतल आरती दीया (Heavy Brass Diya)',
      description: 'प्राचीन मंदिर डिजाइन युक्त मजबूत पीतल का पंच आरती दीया, लकड़ी का हत्था, नित्य व विशेष आरती के लिए सर्वोत्तम।',
      price: 499,
      mrp: 750,
      rating: 4.7,
      reviewCount: 215,
      stock: 75,
      type: 'STANDARD',
      weight: 450,
      unit: 'g',
      imageUrl: '/chandal_thali.jpeg',
      categoryId: dbCategories[2].id,
      vendorId: vendor.id,
      status: 'APPROVED'
    },
    {
      name: 'प्राकृतिक चंदन एवं गुग्गुल प्रीमियम धूप बत्ती (Combo Pack of 4)',
      description: 'चारकोल रहित, 100% जैविक देसी गाय के घी व जड़ी-बूटियों से निर्मित सुगंधित प्रीमियम अगरबत्ती व धूप।',
      price: 299,
      mrp: 450,
      rating: 4.8,
      reviewCount: 560,
      stock: 200,
      type: 'STANDARD',
      weight: 400,
      unit: 'g',
      imageUrl: '/chandal_thali.jpeg',
      categoryId: dbCategories[4].id,
      vendorId: vendor.id,
      status: 'APPROVED'
    },
    {
      name: 'सिद्ध श्री गणेश व महालक्ष्मी पीतल विग्रह (Solid Brass Murti Set)',
      description: 'सुंदर नक्काशीदार अष्टधातु पॉलिश युक्त 4 इंच के श्री गणेश एवं माता लक्ष्मी जी की अत्यंत मनमोहक मूर्तियां।',
      price: 1899,
      mrp: 2799,
      rating: 5.0,
      reviewCount: 184,
      stock: 25,
      type: 'STANDARD',
      weight: 1.2,
      unit: 'kg',
      imageUrl: '/ganesha.jpeg',
      categoryId: dbCategories[3].id,
      vendorId: vendor.id,
      status: 'APPROVED'
    },
    {
      name: 'वैदिक हवन सामग्री महा पैकेट (51 दिव्य औषधियां व जड़ी-बूटियां 1kg)',
      description: 'नागरमोथा, जावित्री, गूगल, लोबान, जटामांसी, कमल गट्टा, गिलोय आदि 51 दुर्लभ जड़ी-बूटियों का शुद्ध मिश्रण।',
      price: 420,
      mrp: 600,
      rating: 4.8,
      reviewCount: 390,
      stock: 100,
      type: 'STANDARD',
      weight: 1,
      unit: 'kg',
      imageUrl: '/havan_set.jpeg',
      categoryId: dbCategories[0].id,
      vendorId: vendor.id,
      status: 'APPROVED'
    },
    {
      name: 'शुद्ध तांबा कलश एवं श्रीफल नारियल सेट (Mangal Kalash Combo)',
      description: 'पवित्र मांगलिक पूजा, नवरात्रि घटस्थापना व गृह प्रवेश हेतु शुद्ध तांबे का कलश, आम्र पल्लव व श्रीफल।',
      price: 549,
      mrp: 799,
      rating: 4.7,
      reviewCount: 174,
      stock: 60,
      type: 'STANDARD',
      weight: 600,
      unit: 'g',
      imageUrl: '/kalash_with_coco.jpeg',
      categoryId: dbCategories[2].id,
      vendorId: vendor.id,
      status: 'APPROVED'
    }
  ];

  for (const prod of productsData) {
    let existing = await prisma.product.findFirst({ where: { name: prod.name } });
    if (!existing) {
      existing = await prisma.product.create({ data: prod });
      await prisma.inventory.create({
        data: {
          warehouseId: warehouse.id,
          productId: existing.id,
          quantity: prod.stock,
          reservedQuantity: 0
        }
      });
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: { status: 'APPROVED', price: prod.price, mrp: prod.mrp, imageUrl: prod.imageUrl }
      });
    }
  }

  // 5. Panchangs
  const todayStr = new Date();
  todayStr.setHours(0, 0, 0, 0);
  let panchang = await prisma.panchang.findFirst({ where: { date: todayStr } });
  if (!panchang) {
    await prisma.panchang.create({
      data: {
        date: todayStr,
        tithi: 'शुक्ल पक्ष द्वादशी (तिथी समाप्ति रात्रि 09:45)',
        nakshatra: 'श्रवण नक्षत्र (उपरांत धनिष्ठा)',
        sunrise: '06:04 AM',
        sunset: '06:34 PM',
        details: 'आज का दिन अत्यंत शुभ है। भगवान श्री हरि विष्णु एवं माता महालक्ष्मी की आराधना फलदायी है। आज के दिन सत्यनारायण कथा व दीपक दान से घर में सुख-समृद्धि आती है। अभिजित मुहूर्त: 11:54 AM - 12:44 PM। राहुकाल: 04:30 PM - 06:00 PM।'
      }
    });
  }

  // 6. Horoscopes
  const zodiacSigns = [
    { sign: 'मेष (Aries)', prediction: 'आज का दिन आत्मविश्वास व ऊर्जा से भरा रहेगा। कार्यक्षेत्र में नए अवसर मिलेंगे। व्यापार में आर्थिक लाभ के योग हैं। पारिवारिक जीवन सुखद रहेगा। उपाय: हनुमान चालीसा का पाठ करें।' },
    { sign: 'वृषभ (Taurus)', prediction: 'आर्थिक मामलों में सावधानी बरतें। पुराने निवेश से लाभ मिल सकता है। माता-पिता के स्वास्थ्य का ध्यान रखें। रचनात्मक कार्यों में सफलता मिलेगी। उपाय: माता लक्ष्मी को सुगंधित धूप अर्पित करें।' },
    { sign: 'मिथुन (Gemini)', prediction: 'विद्यार्थियों व लेखकों के लिए उत्तम दिन है। वाणी में मधुरता से बिगड़े काम बनेंगे। स्वास्थ्य सामान्य रहेगा। यात्रा के योग बन रहे हैं। उपाय: गणेश जी को दूर्वा चढ़ाएं।' },
    { sign: 'कर्क (Cancer)', prediction: 'मानसिक शांति का अनुभव होगा। आध्यात्मिक कार्यों में रुचि बढ़ेगी। किसी पुराने मित्र से मुलाकात हो सकती है। वित्तीय स्थिति सुदृढ़ होगी। उपाय: शिवलिंग पर कच्चा दूध व गंगाजल अर्पित करें।' },
    { sign: 'सिंह (Leo)', prediction: 'मान-सम्मान व प्रतिष्ठा में वृद्धि होगी। उच्चाधिकारियों का सहयोग प्राप्त होगा। साझेदारी के व्यापार में लाभ होगा। संयम बनाए रखें। उपाय: प्रातः सूर्य देव को अर्घ्य दें।' },
    { sign: 'कन्या (Virgo)', prediction: 'कार्यस्थल पर आपकी मेहनत की सराहना होगी। नई योजनाएं फलीभूत होंगी। लेन-देन में सतर्कता बरतें। परिवार में मांगलिक कार्यक्रम की चर्चा होगी। उपाय: गाय को हरा चारा खिलाएं।' },
    { sign: 'तुला (Libra)', prediction: 'व्यापार में लाभ के नए स्रोत खुलेंगे। वैवाहिक जीवन में प्रेम व सामंजस्य बढ़ेगा। अनावश्यक खर्चों पर नियंत्रण रखें। उपाय: देवी दुर्गा की आरती करें।' },
    { sign: 'वृश्चिक (Scorpio)', prediction: 'साहस और पराक्रम में वृद्धि होगी। भूमि-भवन संबंधी कार्यों में सफलता मिल सकती है। खान-पान का ध्यान रखें। उपाय: सुंदरकांड का पाठ करें।' },
    { sign: 'धनु (Sagittarius)', prediction: 'गुरु कृपा से ज्ञान व अध्यात्म में वृद्धि होगी। धार्मिक यात्रा का योग है। रुके हुए सरकारी काम पूर्ण होंगे। उपाय: भगवान विष्णु को पीले पुष्प अर्पित करें।' },
    { sign: 'मकर (Capricorn)', prediction: 'कठिन परिश्रम का उचित फल मिलेगा। कार्यक्षेत्र में जिम्मेदारी बढ़ सकती है। आर्थिक स्थिति संतुलित रहेगी। उपाय: पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।' },
    { sign: 'कुम्भ (Aquarius)', prediction: 'नवीन विचारों से कार्य में प्रगति होगी। सामाजिक कार्यों में सहभागिता बढ़ेगी। मित्रों का सहयोग प्राप्त होगा। उपाय: शनि स्तोत्र का पाठ करें।' },
    { sign: 'मीन (Pisces)', prediction: 'मन शांत व प्रसन्न रहेगा। शिक्षा व प्रतियोगिता के क्षेत्र में उत्तम सफलता मिलेगी। धन आगमन के मार्ग प्रशस्त होंगे। उपाय: केसर का तिलक लगाएं।' }
  ];

  for (const z of zodiacSigns) {
    const existing = await prisma.horoscope.findFirst({ where: { sign: z.sign, date: todayStr } });
    if (!existing) {
      await prisma.horoscope.create({
        data: {
          sign: z.sign,
          prediction: z.prediction,
          date: todayStr
        }
      });
    }
  }

  // 7. Pooja Vidhis
  const vidhis = [
    {
      title: 'सत्यनारायण भगवान व्रत एवं कथा विधि',
      procedure: '1. प्रातः स्नान कर पीला वस्त्र धारण करें। 2. वेदी पर कलश व गणेश जी की स्थापना करें। 3. पंचामृत, तुलसी दल व पंजीरी का भोग लगाएं। 4. पांच अध्यायों की कथा श्रवण कर आरती व क्षमा प्रार्थना करें।',
      imageUrl: '/havan_set.jpeg'
    },
    {
      title: 'दैनिक प्रातः एवं संध्या आरती विधि',
      procedure: '1. दीप प्रज्वलित कर तीन बार आचमन करें। 2. घंटी व शंख ध्वनि के साथ आरती करें। 3. धूप-दीप द्वारा प्रभु के सम्मुख 7 बार आरती घुमाएं। 4. सभी उपस्थित परिजनों को आरती व चरणामृत दें।',
      imageUrl: '/puja_thali.jpeg'
    },
    {
      title: 'श्री गणेश चतुर्थी स्थापना एवं विसर्जन विधि',
      procedure: '1. ईशान कोण में चौकी पर लाल वस्त्र बिछाएं। 2. मिट्टी के श्री गणेश विग्रह की प्राण प्रतिष्ठा करें। 3. 21 दूर्वा, मोदक व लाल सिंदूर अर्पित करें। 4. 10 दिनों तक नित्य आरती व भोग लगाएं।',
      imageUrl: '/ganesha.jpeg'
    },
    {
      title: 'शारदीय नवरात्रि घटस्थापना एवं अखंड ज्योत विधि',
      procedure: '1. मिट्टी के पात्र में 7 प्रकार के अनाज व जौ बोएं। 2. ऊपर तांबे या मिट्टी का कलश स्थापित करें। 3. कलश पर नारियल व लाल चुनरी रखें। 4. शुद्ध गाय के घी का अखंड दीपक 9 दिन प्रज्वलित रखें।',
      imageUrl: '/kalash_with_coco.jpeg'
    }
  ];

  for (const v of vidhis) {
    const existing = await prisma.poojaVidhi.findFirst({ where: { title: v.title } });
    if (!existing) {
      await prisma.poojaVidhi.create({ data: v });
    }
  }

  // 8. Pandits
  const panditsList = [
    {
      name: 'आचार्य पं. विद्याधर शास्त्री',
      email: 'vidyadhar@hgmer.com',
      phone: '9876543210',
      bio: 'काशी विद्यापीठ से वेदाचार्य, 15+ वर्षों का कर्मकांड, सत्यनारायण कथा, रुद्राभिषेक व गृह प्रवेश अनुभव।',
      experience: 15,
      city: 'दिल्ली / एनसीआर',
      serviceRadius: 30,
      photoUrl: '/pandi_ji.jpeg',
      rating: 4.9,
      price: 3100,
      languages: 'हिन्दी, संस्कृत, मैथिली',
      specializations: 'सत्यनारायण कथा, गृह प्रवेश, रुद्राभिषेक, महामृत्युंजय जाप'
    },
    {
      name: 'पंडित राधेश्याम त्रिपाठी जी',
      email: 'radheshyam@hgmer.com',
      phone: '9876543211',
      bio: 'वाराणसी (काशी) दशाश्वमेध घाट के प्रमुख पुरोहित, कालसर्प व नवग्रह शांति विशेषज्ञ।',
      experience: 12,
      city: 'वाराणसी / काशी',
      serviceRadius: 25,
      photoUrl: '/pandi_ji.jpeg',
      rating: 5.0,
      price: 4500,
      languages: 'हिन्दी, संस्कृत, गुजराती',
      specializations: 'कालसर्प दोष शांति, नवग्रह शांति, महालक्ष्मी यज्ञ'
    },
    {
      name: 'आचार्य केशव देव भारद्वाज',
      email: 'keshav@hgmer.com',
      phone: '9876543212',
      bio: 'अयोध्या धाम से श्रीमद्भागवत व सुंदरकांड के प्रकांड वक्ता एवं वैदिक अनुष्ठानकर्ता।',
      experience: 18,
      city: 'लखनऊ / अयोध्या',
      serviceRadius: 40,
      photoUrl: '/pandi_ji.jpeg',
      rating: 4.8,
      price: 2500,
      languages: 'हिन्दी, संस्कृत, अवधी',
      specializations: 'सुंदरकांड पाठ, रामचरितमानस नवाह्न, मुंडन व नामकरण संस्कार'
    }
  ];

  for (const p of panditsList) {
    let user = await prisma.user.findFirst({ where: { email: p.email } });
    if (!user) {
      const hash = await bcrypt.hash('pandit123', 10);
      user = await prisma.user.create({
        data: {
          name: p.name,
          email: p.email,
          phone: p.phone,
          passwordHash: hash,
          role: 'PANDIT',
          panditProfile: {
            create: {
              bio: p.bio,
              experience: p.experience,
              city: p.city,
              serviceRadius: p.serviceRadius,
              photoUrl: p.photoUrl,
              rating: p.rating,
              price: p.price,
              languages: p.languages,
              specializations: p.specializations,
              status: 'APPROVED'
            }
          }
        }
      });
    } else {
      await prisma.panditProfile.updateMany({
        where: { userId: user.id },
        data: { status: 'APPROVED', rating: p.rating, price: p.price, photoUrl: p.photoUrl, languages: p.languages, specializations: p.specializations }
      });
    }
  }

  // 9. Consultancy Services
  const consultancyServices = [
    {
      title: 'सम्पूर्ण जन्म कुंडली विश्लेषण (Full Kundali Analysis)',
      description: 'ग्रहों की दशा, महादशा, अंतर्दशा, अनुकूल-प्रतिकूल समय, स्वास्थ्य, धन, पारिवारिक सुख व जीवन के प्रमुख योगों का विस्तृत वैदिक अध्ययन।',
      price: 1100,
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&fit=crop'
    },
    {
      title: 'कुंडली मिलान एवं गुण मिलान (Kundali Matching)',
      description: 'अष्टकूट गुण मिलान (36 गुण), मांगलिक दोष विचार, नाड़ी दोष विश्लेषण व वैवाहिक सुख-शांति हेतु शास्त्रोक्त परामर्श।',
      price: 850,
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&fit=crop'
    },
    {
      title: 'गृह एवं व्यापार वास्तु परामर्श (Vastu Shastra Consultation)',
      description: 'घर, दुकान, कार्यालय या फैक्ट्री में वास्तु दोषों का निवारण। बिना तोड़-फोड़ के ऊर्जा संतुलन व सुख-समृद्धि हेतु सरल उपाय।',
      price: 2100,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&fit=crop'
    },
    {
      title: 'करियर, व्यापार एवं धन लाभ मार्गदर्शन (Career & Finance)',
      description: 'नौकरी, पदोन्नति, नया व्यापार प्रारंभ करने का शुभ समय, शेयर बाजार व संपत्ति निवेश में सफलता हेतु वैदिक ज्योतिषीय मार्गदर्शन।',
      price: 999,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&fit=crop'
    },
    {
      title: 'रत्न परामर्श एवं यंत्र शुद्धि (Gemstone Recommendation)',
      description: 'आपकी लग्न व राशि अनुसार कौन सा रत्न, रुद्राक्ष व यंत्र धारण करना सर्वाधिक फलदायी रहेगा, उसकी संपूर्ण विधि।',
      price: 500,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&fit=crop'
    }
  ];

  for (const cs of consultancyServices) {
    const existing = await prisma.consultancyService.findFirst({ where: { title: cs.title } });
    if (!existing) {
      await prisma.consultancyService.create({ data: cs });
    }
  }

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

seed()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
