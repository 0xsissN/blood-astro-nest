import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DonationsService } from './donations.service';
import { Donation } from './entities/donation.entity';
import { BloodUnit } from './entities/blood-unit.entity';
import { BloodStock } from './entities/blood-stock.entity';
import { Donor } from '../donors/entities/donor.entity';
import { BloodType } from '../donors/entities/blood-type.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DonationsService', () => {
  let service: DonationsService;

  const mockDonationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockBloodUnitRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockBloodStockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDonorRepository = {
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockBloodTypeRepository = {
    findOne: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationsService,
        {
          provide: getRepositoryToken(Donation),
          useValue: mockDonationRepository,
        },
        {
          provide: getRepositoryToken(BloodUnit),
          useValue: mockBloodUnitRepository,
        },
        {
          provide: getRepositoryToken(BloodStock),
          useValue: mockBloodStockRepository,
        },
        {
          provide: getRepositoryToken(Donor),
          useValue: mockDonorRepository,
        },
        {
          provide: getRepositoryToken(BloodType),
          useValue: mockBloodTypeRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<DonationsService>(DonationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a donation successfully', async () => {
      const createDto = {
        idDonante: 1,
        idTipoSangre: 1,
        fechaDonacion: '2026-01-01',
        cantidadMl: 450,
      };

      const donor = {
        id: 1,
        nombre: 'Juan',
        ci: '12345678',
        activo: true,
        tipoSangre: { id: 1 },
      };
      const bloodType = { id: 1, grupo: 'A', factorRh: '+' };

      mockDonorRepository.findOne.mockResolvedValue(donor);
      mockBloodTypeRepository.findOne.mockResolvedValue(bloodType);
      mockBloodStockRepository.findOne.mockResolvedValue(null);
      mockBloodStockRepository.create.mockReturnValue({ id: 1 });
      mockBloodStockRepository.save.mockResolvedValue({ id: 1 });
      mockDonationRepository.create.mockReturnValue({ id: 1 });
      mockDataSource
        .createQueryRunner()
        .manager.save.mockResolvedValue({ id: 1 });

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.donante.nombre).toBe('Juan');
    });

    it('should throw NotFoundException when donor not found', async () => {
      const createDto = {
        idDonante: 999,
        idTipoSangre: 1,
        fechaDonacion: '2026-01-01',
        cantidadMl: 450,
      };

      mockDonorRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when quantity is invalid', async () => {
      const createDto = {
        idDonante: 1,
        idTipoSangre: 1,
        fechaDonacion: '2026-01-01',
        cantidadMl: 100,
      };

      const donor = { id: 1, activo: true };
      const bloodType = { id: 1 };

      mockDonorRepository.findOne.mockResolvedValue(donor);
      mockBloodTypeRepository.findOne.mockResolvedValue(bloodType);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of donations', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockDonationRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('getMonthlyStats', () => {
    it('should return monthly statistics', async () => {
      const stats = [
        {
          mes: '1',
          total_donaciones: '10',
          total_ml: '4500',
          promedio_ml: '450',
        },
      ];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(stats),
      };
      mockDonationRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getMonthlyStats(2026);

      expect(result).toHaveLength(1);
      expect(result[0].mes).toBe('Enero');
      expect(result[0].totalDonaciones).toBe(10);
    });
  });
});
